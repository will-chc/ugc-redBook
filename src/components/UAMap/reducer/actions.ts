import type from "./type";
const {CHANGE_ADDRESS} = type;

interface AddressIF {
    name:string,
    lat:number,
    lng:number
}
export const changeAddress = (address:AddressIF) =>{
    return {
        type:CHANGE_ADDRESS,
        address
    };
};