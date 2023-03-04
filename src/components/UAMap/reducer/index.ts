import type from "./type";
const { CHANGE_ADDRESS } = type;
interface reducerProps {
    address: {
        lat: number,
        lng: number,
        name: string
    }
}
const initState: reducerProps = {
    address: {
        lat: 0,
        lng: 0,
        name: ''
    }
}
const mapReducer = (state = initState, action: any) => {
    switch (action.type) {
        case CHANGE_ADDRESS:
            return { ...state, address: action.address }
        default:
            return state;
    }
}

export default mapReducer;