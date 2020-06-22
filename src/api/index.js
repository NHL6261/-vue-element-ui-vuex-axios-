import ajax from './ajax'
// 获取 验证码
export const getCodeDetail = ({ phone }) => ajax({
    url: '/getcodedetail',
    method: 'POST',
    data: {
        phone
    }
})

// 注册
export const getRegisterDetail = ({ username, pwd, verification, phone }) => ajax({
    url: '/getcodedetail',
    method: 'POST',
    data: {
        username,
        pwd,
        verification,
        phone
    }
})

// 登录 暂时get
export const getLoginInfo = () => ajax({
    url: '/getListUserInfo'
})


// 获取 左侧 menu 列表页面
export const getLeftMenuInfo = () => ajax({
    url: '/menus'
})


// 获取user 信息
export const getUserListInfo = () => ajax({
    url: '/users'
})