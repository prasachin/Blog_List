const blog = require("../models/blog");

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let sum = 0;
    for (let i = 0; i < blogs.length; i++) {
        sum += blogs[i].likes;
    }
    return sum;
}


const favouriteblog = (blog) => {
    let mxi = 0;
    let ans = [];
    for (let i = 0; i < blog.length; i++) {
        if (blog[i].likes >= mxi) {
            ans = blog[i];
            mxi = blog[i].likes;
        }
    }
    return ans;
}
const mostblog = (blog) => {

}

const mostlikes = (blog) => {
    let mxi = 0;
    let ans = [];
    for (let i = 0; i < blog.length; i++) {
        if (blog[i].likes >= mxi) {
            ans = [{
                author: blog[i].author,
                likes: blog[i].likes
            }];
            mxi = blog[i].likes;
        }
    }
    return ans;
}

module.exports =
{
    dummy,
    totalLikes,
    favouriteblog,
    mostlikes
}