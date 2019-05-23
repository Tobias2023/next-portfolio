import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { getSortedPosts } from 'data/BlogPosts';
import BlogLink from '../BlogLink';

const BlogNavigation = ({ router }) => {
  const currHref = router.route;

  // Get blog posts, sorted oldest to newest
  const sortedPosts = getSortedPosts({ order: 'asc' });

  // Get index of current blog post
  const currPostIndex = sortedPosts.findIndex(post => post.href === currHref);

  // Get prev post
  const PrevPost = () => {
    if (currPostIndex > 0) {
      const prevPost = sortedPosts[currPostIndex - 1];
      return (
        <BlogLink href={prevPost.href}>&#10229; {prevPost.title}</BlogLink>
      );
    }

    return <span />;
  };

  // Get next post
  const NextPost = () => {
    if (currPostIndex < sortedPosts.length - 1) {
      const nextPost = sortedPosts[currPostIndex + 1];
      return (
        <BlogLink href={nextPost.href} rtl>
          &#10230; {nextPost.title}
        </BlogLink>
      );
    }

    return <span />;
  };

  return (
    <NavContainer>
      <PrevPost />
      <NextPost />
    </NavContainer>
  );
};

BlogNavigation.propTypes = {
  router: PropTypes.shape({
    route: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(BlogNavigation);

const NavContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;