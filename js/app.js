import SmartTable from "./components/SmartTable.js";

window.addEventListener('DOMContentLoaded', (event) => {
    Vue.createApp({
        name: 'Application',
        data() {
            return {
                columnsUserTable: {
                    id: 'ID',
                    name: 'Имя',
                    username: 'Никнейм',
                    phone: 'Телефон',
                    website: 'Сайт'
                },
                columnsPostsTable: {
                    userId: 'userId',
                    id: 'ID',
                    title: 'Название',
                    body: 'Содержание'
                },
                userActionPanel: [
                    {
                        title: 'Получить посты',
                        cb: this.getPosts
                    },
                    {
                        title: 'Обновить список',
                        cb: this.refreshUsers
                    }
                ],
                users: [],
                posts: [],
                selectedUser: []
            }
        },
        methods: {
            refreshUsers(row, refresh) {
                refresh();
            },
            getPosts(row) {
                if(row) {
                    fetch(`https://jsonplaceholder.typicode.com/users/${row.id}/posts`)
                        .then(res => res.json())
                        .then(res => {
                            this.posts = res;
                        })
                } else {
                    this.posts = [];
                }
            }
        },
        components: {
            SmartTable
        }
    }).mount('#app');
})