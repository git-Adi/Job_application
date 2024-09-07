class User{
    constructor(username){
        this.userId = User.generateID();
        this.username = username;
        this.posts = [];
        this.following = [];
        this.followers = [];
    }
    static generateID(){
        return '_' + Math.random().toString(36)
    }
    addPost(content){
        const post = new Post(this.userId, content);
        this.posts.push(post);
        return post;
    }
    deletePost(postId){
        this.posts = this.posts.filter(post => post.postId !== postId);
    }
    follow(user){
        if(!this.following.includes(user.userId)){
            this.following.push([user.userId, user.username]);
            user.followers.push([this.userId, this.username]);
        }
    }
    unfollow(user){
        if (this.following.some(([followingId, followingName]) => followingId === user.userId && followingName === user.username)) {
            this.following = this.following.filter(([followingId, followingname]) => followingId !== user.userId && followingname !== user.username);
            user.followers = user.followers.filter(([followerId, followername]) => followerId !== this.userId && followername !== this.username);
        }
    }
    getPosts(){
        return this.posts;
    }
    getFollowers(){
        return this.followers;
    }
    getFollowing(){
        return this.following;
    }
}
class Post {
    constructor(userId, content){
        this.postId = Post.generateId;
        this.userId = userId;
        this.content = content;
        this.timestamp = new Date();
    }
    static generateId(){
        return '_' + Math.random().toString(36);
    }
}

const user1 = new User('Alice');
const user2 = new User('Bob');

const post1 = user1.addPost('Hello World');
console.log('User1 Post: ', user1.getPosts());

user1.follow(user2);
console.log('User1 Following:', user1.getFollowing());
console.log('User2 Followers:', user2.getFollowers());

user1.unfollow(user2);
console.log('User1 Following:', user1.getFollowing());
console.log('User2 Followers:', user2.getFollowers());

user1.deletePost(post1.postId);
console.log('User1 Posts after deletion:', user1.getPosts());