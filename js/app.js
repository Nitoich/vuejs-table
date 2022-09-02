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
                        title: 'Удалить',
                        cb: function(row) {
                            console.log(row._i, 'is delete!')
                        }
                    },
                    {
                        title: 'Редактировать',
                        cb: function(row){
                            console.log(row._i, 'has edit!')
                        }
                    }
                ],
                users: [],
                posts: [],
                selectedUser: []
            }
        },
        created() {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(res => res.json())
                .then(res => {
                    this.users = res;
                })
        },
        methods: {
            getPosts() {
                if(this.selectedUser) {
                    fetch(`https://jsonplaceholder.typicode.com/users/${this.selectedUser.id}/posts`)
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