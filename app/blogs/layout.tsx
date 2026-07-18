import React from 'react';

const BlogsLayout = ({children} : {children: React.ReactNode;
}) => {
    return (
        <div>
            Blogs Layout
            {children}
        </div>
    )
};

export default BlogsLayout;