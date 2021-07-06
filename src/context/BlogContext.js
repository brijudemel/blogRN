import createDataContext from './createDataContext';
import jsonServer from '../api/jsonServer';

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'get_blogPosts':
      return action.payload;
    case 'edit_blogPost':
      return state.map(blogPost => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    case 'delete_blogPost':
      return state.filter(blogPost => blogPost.id !== action.payload);
    default:
      return state;
  }
};

const getBlogPosts = dispatch => {
  return async () => {
    try{
      const response = await jsonServer.get('/blogPosts');

       dispatch({ type: 'get_blogPosts', payload: response.data });
    }
    catch(err){
      console.warn(err)
    }
    
  };
};

const addBlogPost = dispatch => {
  return async (title, content, callback) => {
    try{
        await jsonServer.post('/blogPosts', { title, content });

    if (callback) {
      callback();
    }
    }
    catch(err)
    {
      console.warn(err)
    }
  };
};

const deleteBlogPost = dispatch => {
  return async id => {
    try{

    
    await jsonServer.delete(`/blogPosts/${id}`);

    dispatch({ type: 'delete_blogPost', payload: id });
    }
    catch(err)
    {
      console.warn(err)
    }
  };
};

const editBlogPost = dispatch => {
  return async (id, title, content, callback) => {
    try{

    
    await jsonServer.put(`/blogPosts/${id}`, { title, content });

    dispatch({
      type: 'edit_blogPost',
      payload: { id, title, content }
    });
    if (callback) {
      callback();
    }
  }
  catch(err)
    {
      console.warn(err)
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);
