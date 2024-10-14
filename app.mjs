import fetch from 'node-fetch';

async function fetchUsersWithPosts() {
    const usersApi = 'https://jsonplaceholder.typicode.com/users';
    const postsApi = 'https://jsonplaceholder.typicode.com/posts?userId=';

    try {
        const usersResponse = await fetch(usersApi);

        if (!usersResponse.ok) {
            throw new Error('Failed to get users');
        }

        const users = await usersResponse.json();

        const usersWithPosts = await Promise.all(
            users.map(async (user) => {
                const userPostsApi = `${postsApi}${user.id}`; // исправлено на шаблонные строки
                
                const postsResponse = await fetch(userPostsApi);
                
                if (!postsResponse.ok) {
                    throw new Error(`Failed to get posts for user ID ${user.id}`); // исправлено добавление кавычек
                }
                
                const posts = await postsResponse.json();

                return {
                    id: user.id,
                    name: user.name,
                    posts: posts.map(post => post.title) // Массив заголовков постов
                };
            })
        );

        return usersWithPosts;

    } catch (error) {
        return Promise.reject(error.message);
    }
}

// Вызов функции и обработка результата
fetchUsersWithPosts()
    .then(data => console.log(data))
    .catch(err => console.error(err));
