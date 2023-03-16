const express = require('express');
const jwt = require('jsonwebtoken');

const upload = require("../multer/upload.js");
const { db } = require('../MySQL/connect');
const router = express.Router();

const secretKey = 'scret'; //密钥用于签名和验证JWT;

// 图片上传
router.post('/uploadImg', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    upload(req, res).then(imgsrc => {
        console.log('上传成功', imgsrc);
        res.send({
            src: imgsrc
        });
    }).catch(err => {
        console.log(err);
        next(err);
    })
});


// 注册
router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    db.select('user', 'email, password', `where email = '${email}' `)
        .then(result => {
            if (result.length > 0) {
                res.send({ data: { err: "该邮箱已注册账号" } });
                return;
            } else {
                // 默认昵称和头像
                const nickName = `小红酥${Math.random().toString(36).substring(2, 6)}`;
                const avatar = '	http://localhost:5000/images/90154478_p1_master1200.jpg';
                return db.insert('user', { email, password, nickName, avatar })
                    .then(resolve => {
                        res.send({ data: { status: 'success', message: "注册成功" } });
                        return;
                    })
                    .catch(error => {
                        res.send({ data: { status: 'fail', err: '注册失败' } });
                        return;
                    });
            }
        })
        .catch(error => {
            res.send({ data: { status: 'fail', err: '查询失败' } });
        });
});


// 登录

//中间件，验证 JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const { userid } = req.headers;
    console.log(req.headers);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).send({ data: { err: '缺少token' } });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        const { email } = decoded;
        db.select('user', "id", 'where email = ? LIMIT 1', "", [email])
            .then(result => {
                if (result.length > 0 && result[0].id == userid) {
                    next();
                }
                else {
                    res.status(401).send({ data: { err: "token错误或者已过期" } });
                    return;
                }
            });
    } catch (err) {
        res.status(401).send({ data: { err: "token错误或者已过期" } });
    }
}
// 登录接口
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    db.select('user', '*', `where email = ? LIMIT 1`, "", [email])
        .then(result => {
            switch (true) {
                case result.length === 0:
                    res.send({ data: { err: "该邮箱未注册" } });
                    return;
                case result[0].password !== password:
                    res.send({ data: { err: '密码错误' } });
                    return;
                default:
                    // 签发 JWT，有效期为 1 小时
                    const token = jwt.sign({ email }, secretKey, { expiresIn: '1w' });
                    res.send({ data: { msg: 'success', token, user: result[0] } });
                    return;
            }
        })
        .catch(error => {
            res.send({ data: { status: 'fail', err: '查询失败' } });
        });
});

router.get('/test', authenticate, (req, res, next) => {
    res.send({ data: { msg: '1111' } })
});

// 获取用户信息
router.get('/userInfo', (req, res, next) => {
    const { user_id } = req.query;
    db.select('user', 'email, nickName, avatar, brief', 'where id = ? limit 1', [], [user_id]).then(result => {
        res.send({ data: result[0] });
    })
});


// 创建笔记
router.post('/create_note', authenticate, async (req, res, next) => {
    const { userid: user_id } = req.headers;
    const { imgArr, address, text } = req.body;
    const { lat: latitude, lng: longitude, name } = address;
    const { title, content } = text;
    const cover_image = imgArr[0];

    const images = Array(6).fill(null);
    imgArr.forEach((img, i) => {
        if (i < images.length) {
            images[i] = img;
        }
    });
    const [image_1, image_2, image_3, image_4, image_5, image_6] = images;

    try {
        const result = await db.select('location', 'id', 'where name = ? limit 1 ', "", [name]);
        let location_id;
        if (result.length > 0) {
            location_id = result[0].id;
        }
        else {
            const locationResult = await db.insert('location', { latitude, longitude, name });
            location_id = locationResult.insertId;
        }

        await db.insert('note', { user_id, title, content, cover_image, image_1, image_2, image_3, image_4, image_5, image_6, location_id });
        res.send({ data: { msg: 'success' } });
    } catch (err) {
        next(err);
    }
});

// 获取笔记列表
router.get('/note_list', async (req, res, next) => {

    const { user_id, page } = req.query;
    const pageSize = 20;
    const condition = user_id ? `where user_id = ?` : '';

    const start = (page - 1) * pageSize;

    const result = await db.select('note', 'id, user_id, title, cover_image', condition, "ORDER BY created_at DESC" + ` limit ${start}, ${pageSize}`, [user_id]);

    const hasNextPage = result.length < pageSize ? false : true;

    const resultList = [];
    for (const r of result) {
        const userInfo = await db.select('user', 'nickName, avatar', "where id = ?", "", [r.user_id]);
        let liked = await db.select('`like`', 'id', 'where user_id = ? and note_id = ?', "", [r.user_id, r.id]);
        liked = liked.length > 0 ? true : false;
        resultList.push({ ...r, userInfo: userInfo[0], liked });
    }
    res.send({ data: { resultList, hasNextPage } });
});


// 笔记信息
router.get('/note_detail', async (req, res, next) => {
    // note id
    const { id } = req.query;
    // 查询数据库
    const result = await db.select('note', '*', 'where id = ? limit 1', "", [id]);
    // 详细信息
    const { image_1, image_2, image_3, image_4, image_5, image_6, ...note } = result[0];
    const imgArrRaw = [image_1, image_2, image_3, image_4, image_5, image_6];
    // 去除空的img
    const img_arr = imgArrRaw.filter(Boolean);
    // 获取地址
    const localtionResult = await db.select('location', "*", 'where id = ? limit 1', '', [note.location_id]);
    delete note.location_id;
    res.send({ data: { ...note, img_arr, localtion: localtionResult[0] } });
});

//作品点赞
router.post('/like', authenticate, async (req, res, next) => {
    let { note_id, user_id, liked } = req.body;
    user_id = Number(user_id);
    if (liked === true) {
        await db.insert('`like`', { note_id, user_id });
        res.send({ data: { msg: '点赞成功' } });

    }
    else {
        await db.delete('`like`', 'where note_id = ? and user_id = ?', [note_id, user_id]);
        res.send({ data: { msg: '取消点赞' } });
    }
});
// 用户关注
router.post('/follow', authenticate, async (req, res, next) => {
    const { follower_id, followee_id, new_follow } = req.body;
    // 查询索引是否存在
    let isExist = await db.select('follow', '*', 'where follower_id = ? and followee_id = ? ', "", [follower_id, followee_id]);
    isExist = isExist.length > 0 ? true : false;
    if (isExist && !new_follow) {
        await db.delete('follow', 'where follower_id = ? and followee_id = ?', [follower_id, followee_id])
        res.send({ data: { msg: '取消关注',isFollowed:false } });
    }
    else {
        await db.insert('follow', { follower_id, followee_id });
        res.send({ data: { msg: "关注成功", isFollowed: true } });
    }
});

router.get('/isfollow', async (req, res, next) => {
    const { follower_id, followee_id } = req.query;
    // 查询索引是否存在
    let isFollowed = await db.select('follow', '*', 'where follower_id = ? and followee_id = ? ', "", [follower_id, followee_id]);
    isFollowed = isFollowed.length > 0 ? true : false;
    res.send({ data: { isFollowed } });
});

router.get('/follow_list', async (req, res, next) => {
    const {user_id} = req.query;
    
    const list = await db.select('follow', 'followee_id', 'where follower_id = ? ',"ORDER BY created_at DESC", [ user_id]);
    let followList = [];
    for (const l of list) {
        const res = await db.select('user', 'nickName, avatar', 'where id = ? ', "limit 1", [l.followee_id] );
        followList.push({...res[0], user_id: l.followee_id, followed:true});
    }
    res.send({data:{msg:'success', followList}});
})




module.exports = router;