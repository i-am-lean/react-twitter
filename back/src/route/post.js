//Підключаємо технологію express для back-end сервера
const express = require('express')
//Створюємо роутер-місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { Post } = require('../class/post')

//================================================================

// router.get створює нам один ендпоїнт

// тут виводимо шлях (PATH) до сторінки

router.post('/post-create', function (req, res) { //через метод post для класу post
    try {
        const { username, text, postId } = req.body //отримати данні
        console.log('req.body: ', username, text, postId)

        if (!username || !text) {
            return res.status(400).json({
                message:
                    'Потрібно передати всі дані для створення поста',
            })
        } // перевіряємо чи є данні

        let post = null //створюємо пусту змінну post

        console.log(postId, 'postId') //виводимо в консоль щоб перевірити чи все працює коректно

        if (postId) { //шукаємо по id існуючий пост
            post = Post.getById(Number(postId))
            console.log('post', post)

            if (!post) {
                return res.status(400).json({
                    message: 'Пост з таким ID не існує', //якщо пост не знаходить по заданому id
                })
            }
        }

        const newPost = Post.create(username, text,post) //збираємо дані в купу по знайденим данним

        return res.status(200).json({
            post: {
                id: newPost.id,
                text: newPost.text,
                username: newPost.username,
                date: newPost.date,
            },
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
})


//робтмо щоб список постів виводився на екран
router.get('/post-list', function (req, res) {
    try {
        const list = Post.getList() //отримуємо список постів

        if (list.length === 0) {
            return res.status(200).json({
                list: [], //якщо довжина поста = 0, то повертаємо пустий масив в list
            })
        }

        return res.status(200).json({
            list: list.map(({ id, username, text, date }) => ({
                id,
                username,
                text,
                date,
            })), //в іншому випадку робимо map куди виводимо данні і потім їх же повертаємо, щоб зайве не вивелось на екран користувачеві
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message,
        })
    }
})

router.get('/post-item', function (req, res) {
    try {
        const { id } = req.query

        if (!id) {
            return res.status(400).json({
                message: 'Потрібно передати ID поста',
            })
        }

        const post = Post.getById(Number(id))

        if (!post) {
            return res.status(400).json({
                message: 'Пост з таким ID не існує',
            })
        }

        return res.status(200).json({
            post: {
                id: post.id,
                text: post.id,
                username: post.username,
                date: post.date,

                reply: post.reply.map((reply) => ({
                    id: reply.id,
                    text: reply.text,
                    username: reply.username,
                    date: reply.date,
                })),
            },
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message,
        })
    }
})

module.exports = router