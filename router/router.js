const express = require('express');
const jwt = require('jsonwebtoken');

const upload = require("../multer/upload.js");
const { db } = require('../MySQL/connect');
const router = express.Router();
const { getSevenDateArray } = require("../utils/time");

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
router.get('/userInfo', async (req, res, next) => {
    const { user_id } = req.query;
    const result = await db.select('user', 'email, nickName, avatar, brief', 'where id = ? limit 1', [], [user_id]);
    const followInfo = await db.select('follow', "COUNT (*) as count", 'where follower_id = ?', "", [user_id]);
    const fansInfo = await db.select('follow', "COUNT (*) as count", 'where followee_id = ?', "", [user_id]);
    const followData = {
        fansCount: fansInfo[0].count,
        followCount: followInfo[0].count

    }
    res.send({ data: { ...result[0], followData } });
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

    const { user_id, page, my_id } = req.query;
    const pageSize = 20;
    const condition = user_id ? `where user_id = ?` : '';

    const start = (page - 1) * pageSize;

    const result = await db.select('note', 'id, user_id, title, cover_image', condition, "ORDER BY created_at DESC" + ` limit ${start}, ${pageSize}`, [user_id]);

    const hasNextPage = result.length < pageSize ? false : true;

    const resultList = [];
    for (const r of result) {
        const userInfo = await db.select('user', 'nickName, avatar', "where id = ?", "", [r.user_id]);
        let liked = await db.select('`like`', 'id', 'where user_id = ? and note_id = ?', "", [my_id, r.id]);
        let count = await db.select('`like`', 'COUNT(*) AS count', 'where note_id = ?', "", [r.id]);
        liked = liked.length > 0 ? true : false;
        resultList.push({ ...r, userInfo: userInfo[0], liked, likedCount: count[0].count });
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
    const locationResult = await db.select('location', "*", 'where id = ? limit 1', '', [note.location_id]);
    delete note.location_id;
    // 更新浏览量
    await db.update('note', { views: note.views + 1 },"where id = ?", [id]);

    res.send({ data: { ...note, img_arr, location: locationResult[0] } });
});

//作品点赞
router.post('/like', authenticate, async (req, res, next) => {
    let { note_id, user_id, liked } = req.body;
    user_id = Number(user_id);
    if (liked === true) {
        let liked = await db.select('`like`', '*', 'where note_id = ? and user_id = ? ', "", [note_id, user_id]);
        if (liked.length == 0) {
            await db.insert('`like`', { note_id, user_id });
        }
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
    if (isExist || !new_follow) {
        await db.delete('follow', 'where follower_id = ? and followee_id = ?', [follower_id, followee_id])
        res.send({ data: { msg: '取消关注', isFollowed: false } });
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
    const { user_id } = req.query;

    const list = await db.select('follow',
        'user.nickName, user.avatar, follow.follower_id', 'JOIN user ON follow.follower_id = user.id',
        'where followee_id = ? ORDER BY created_at DESC',
        [user_id]);
    console.log(list);
    let followList = [];
    for (const l of list) {
        followList.push({ ...l, user_id: l.follower_id, followed: true });
    }
    res.send({ data: { msg: 'success', followList } });
});
//
router.get('/fans_list', async (req, res, next) => {
    const { user_id } = req.query;

    // 联表查询
    const list = await db.select('follow',
        'user.nickName, user.avatar, follow.follower_id', 'JOIN user ON follow.follower_id = user.id',
        'where followee_id = ? ORDER BY created_at DESC',
        [user_id]);
    let fansList = [];
    for (const l of list) {
        const followCount = await db.select('follow', 'COUNT(*) as count', 'where follower_id = ? and followee_id = ?', '', [user_id, l.follower_id]);
        followed = followCount[0].count > 0 ? true : false;
        fansList.push({ ...l, user_id: l.followee_id, followed });
    }

    res.send({ data: { msg: 'success', fansList } });
});

// 获取评论
router.get('/comment_list', async (req, res, next) => {
    const { id, my_id } = req.query;
    const list = await db.select('comment', "comment.user_id, comment.content, user.nickname, comment.id, user.avatar, comment.created_at", "JOIN user ON comment.user_id = user.id",
        "where comment.note_id = ?", [id]);
    const comments = [];
    for (const c of list) {
        let count = await db.select('comment_like', "COUNT (*) as count", "where comment_id = ?", "", [c.id]);
        let liked = await db.select('comment_like', 'id', 'where user_id = ? and comment_id = ?', "", [my_id, c.id]);
        liked = liked.length > 0 ? true : false;
        comments.push({ ...c, likedCount: count[0].count, liked });
    }
    res.send({ data: { count: list.length, comments } });
});

// 评论
router.post('/comment', authenticate, async (req, res, next) => {
    const { user_id, note_id, comments_: content } = req.body;
    await db.insert('comment', { user_id, note_id, content });
    res.send({ data: { msg: 'success' } });
});
// 点赞评论
router.get('/comments_like', authenticate, async (req, res, next) => {
    const { user_id, comment_id, likeStatus } = req.query;
    const isExist = await db.select('comment_like', "*", 'where user_id = ? and comment_id = ? ', "limit 1", [user_id, comment_id]);
    if (isExist.length == 0 && likeStatus) {
        await db.insert('comment_like', { user_id, comment_id });
        res.send({ data: { msg: '点赞成功' } });
    }
    else {
        await db.delete('comment_like', 'where user_id = ? and comment_id = ? ', [user_id, comment_id]);
        res.send({
            data: {
                msg: '取消点赞'
            }
        })
    }
});

// 获取关注数
router.get('/follow_count', async (req, res, next) => {
    const { user_id } = req.query;
    const count = await db.select('follow', "COUNT (*) as count", 'where follower_id = ?', "", [user_id]);
    res.send({
        data: {
            count: count[0].count
        }
    })
});

// 获取粉丝数
router.get('/fans_count', async (req, res, next) => {
    const { user_id } = req.query;
    const count = await db.select('follow', "COUNT (*) as count", 'where followee_id = ?', "", [user_id]);
    res.send({
        data: {
            count: 1
        }
    })
})

// 获取点赞数
router.get('/like_count', async (req, res, next) => {
    const { user_id } = req.query;
    const noteList = await db.select('note', "id", " where user_id = ?", "", [user_id]);
    const ids = noteList.map(({ id }) => id).join(',');
    const count = await db.select('`like`', "COUNT (*) as count", `where note_id IN (${ids})`, "", []);

    res.send({
        data: {
            count: count[0].count
        }
    })
});

// 获取七天内的新增粉丝情况
router.get('/add_fans_data', authenticate, async (req, res, next) => {
    const { user_id } = req.query;
    const newList = await db.select('follow', "DATE(created_at) AS date, COUNT(*) AS new_fans",
        "where followee_id = ? and created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)", "GROUP BY DATE(created_at)", [user_id]);
    let dateArr = getSevenDateArray();
    for (const i of newList) {
        i.date = i.date.toISOString().substring(0, 10);
    }

    dataList = dateArr.map(date => {
        const { new_fans = 0 } = newList.find(d => d.date === date) || {};
        return { date, new_fans };
      });
      
    res.send({
        data: {
            dataList
        }
    })
});

//获取粉丝成分
router.get('/fans_gender', async (req, res, next) => {
    const { user_id } = req.query;
    const genderList =await db.select(
        'follow',
        'COUNT(*) AS count, user.gender',
        'JOIN user ON follow.follower_id = user.id',
        'WHERE follow.followee_id = ? GROUP BY user.gender',
        [user_id]
      );
    let gender = ['U','F','M'];
    const GenderMap = {
        U:'未知',
        F:'男',
        M:'女'
    }
    gender = gender.map(g=>{
        const { count = 0 } = genderList.find(d=>d.gender == g) || {}
        return {gender:GenderMap[g], count}
    });
    res.send({
        data:{
            gender
        }
    })
});

// 获取近七篇笔记的浏览量
router.get('/note_views_7',authenticate, async (req, res, next) =>{
    const { user_id } = req.query;
    const result = await db.select('note', "title, views","where user_id = ?", "ORDER BY created_at DESC limit 7 ",[user_id]);
    const total = await db.select('note', "SUM (views) AS total", 'where user_id = ?',"", [user_id]);
    res.send({
        data:{
            viewsList:result,
        }
    })
});

router.get('/note_data_view', authenticate, async (req, res, next) => {
    const {user_id} = req.query;
    const viewTotal = await db.select('note', "SUM (views) AS total", 'where user_id = ?',"", [user_id]);
    const commentTotal = await db.select('note','COUNT (comment.id) as total', "JOIN comment ON note.id = comment.note_id ", "where note.user_id = ?", [user_id]);
    res.send({
        data:{
            viewTotal: viewTotal[0].total,
            commentTotal:commentTotal[0].total
        }
    })

});

router.get('/like_7', authenticate, async (req,res, next)=> {
    const { user_id } = req.query;
    const likeArr = await db.select('note', " note.id, note.title, COUNT(`like`.id) AS count", 
    "LEFT JOIN `like` ON note.id = `like`.note_id WHERE note.user_id = ?", 
    "GROUP BY note.id ORDER BY note.created_at DESC LIMIT 7", [user_id]);
   
    res.send({
        data:{
            likeArr
        }
    })
});

router.get('/comments_7', authenticate, async (req, res, next) => {
    const { user_id } = req.query;
    const comments = await db.select('note', " note.id, note.title, COUNT(`comment`.id) AS count", 
    "LEFT JOIN `comment` ON note.id = `comment`.note_id WHERE note.user_id = ?", 
    "GROUP BY note.id ORDER BY note.created_at DESC LIMIT 7", [user_id]);
   
    res.send({
        data:{
            comments
        }
    })
})




module.exports = router;