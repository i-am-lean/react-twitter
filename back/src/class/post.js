class Post {
    static #list = [] //пустий масив куди будуть приходити данні
    static #count = 1 //для id

    constructor(username, text) { //конструктор приймає username та text
        this.id = Post.#count++ //створює унікальний id
    
        this.username = username
        this.text = text
        this.date = new Date().getTime() //створюємо поточну дату. Виводить мілісекунди, в фронтенді перетворимо в потрібний вигляд
    
        this.reply = [] //буде містити пости та коментарі 
    }
    
    static create(username, text, post) {
        console.log('In to create: ', username, text, post)
        const newPost = new Post(username, text) //створюємо новий пост
    
        if (post) { 
            post.reply.push(newPost) //якщо третім аргументом прийшов post вже ІСНУЮЧИЙ, то в reply пушимо його

            console.log('Post', post)
        } else {
            this.#list.push(newPost) //якщо ні, то додаємо в ліст вже як новий пост
        }
        
        console.log(this.#list)

        return newPost //повертаємо перевірену функцію
    }
    
    static getById(id) {
        return (
            this.#list.find((item) => item.id === Number(id)) || null
        )
    }
    
    static getList = () => this.#list
}



module.exports = {
    Post,
}

