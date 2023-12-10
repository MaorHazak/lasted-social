export const fetchUser = () => {

    const userInfo = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
    return userInfo
};
export default fetchUser;