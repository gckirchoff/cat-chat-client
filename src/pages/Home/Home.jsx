import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Header } from 'semantic-ui-react';

import { AuthContext } from '../../context/auth';
import { FETCH_POSTS_QUERY } from '../../utils/graphql';

import './Home.scss';
import PostCard from '../../components/PostCard/PostCard';
import PostForm from '../../components/PostForm/PostForm';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  console.log(posts);
  // return (
  //   <>
  //     {user && <PostForm />}
  //     <Grid columns={3}>
  //       <Grid.Row className="home-title">
  //         <h1>Recent Posts</h1>
  //       </Grid.Row>
  //       {/* <Grid.Row>
  //       {user && (
  //         <Grid.Column>
  //           <PostForm />
  //         </Grid.Column>
  //       )}
  //     </Grid.Row> */}
  //       <Grid.Row>
  //         {loading ? (
  //           <h1>Loading posts...</h1>
  //         ) : (
  //           <Transition.Group>
  //             {posts &&
  //               posts.map((post) => (
  //                 <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
  //                   <PostCard post={post} />
  //                 </Grid.Column>
  //               ))}
  //           </Transition.Group>
  //         )}
  //       </Grid.Row>
  //     </Grid>
  //   </>
  // );

  return (
    <>
      <Header as="h2">
        Welcome to Cat Chat!
        <Header.Subheader>
          This social media app uses a custom neural network to only allow users
          to post pictures of cats. Try it out!
        </Header.Subheader>
      </Header>
      <Grid columns={user ? 2 : 1} stretched>
        <Grid.Row className="home-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        {user && (
          <Grid.Column width={5} verticalAlign="top">
            {/* <Grid.Column> */}
            <PostForm />
            {/* </Grid.Column> */}
          </Grid.Column>
        )}
        <Grid.Column width={user ? 11 : 16}>
          <Grid columns={user ? 2 : 3}>
            {loading ? (
              <h1>Loading posts...</h1>
            ) : (
              <Transition.Group>
                {posts &&
                  posts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))}
              </Transition.Group>
            )}
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Home;
