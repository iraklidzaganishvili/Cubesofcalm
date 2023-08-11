import ghpages from 'gh-pages';
import path from 'path';

ghpages.publish(
    // path to public directory
    path.join(process.cwd(), '/build'),
    {
        branch: 'gh-pages', // target branch
        dotfiles: true, // include dotfiles
    },
    (err) => console.log('Deploy Complete!', err)
);