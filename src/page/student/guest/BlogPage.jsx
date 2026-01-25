import React from 'react';
import BlogHero from '../../../components/sections/student/guest/blogPage/BlogHero';
import BlogList from '../../../components/sections/student/guest/blogPage/BlogList';

const BlogPage = () => {
    return (
        <div className="pt-20">
            <BlogHero />
            <BlogList />
        </div>
    );
};

export default BlogPage;
