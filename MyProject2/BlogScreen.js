import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import this

import GardenPost from './GardenPost';

const BlogScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
      return () => {}; // Return a cleanup function if necessary
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://172.20.10.5:5000/api/garden/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

const handleLike = async (postId) => {
  try {
    const response = await fetch(`http://172.20.10.5:5000/api/garden/like/${postId}`, {
      method: 'POST'
    });
    if (response.ok) {
      const data = await response.json();
      const updatedPosts = posts.map(post => post.postId === postId ? { ...post, likes: data.likes } : post);
      setPosts(updatedPosts);
    }
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(`http://172.20.10.5:5000/api/garden/dislike/${postId}`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        const updatedPosts = posts.map(post => post.postId === postId ? { ...post, dislikes: data.dislikes } : post);
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <GardenPost post={item} onLike={handleLike} onDislike={handleDislike} />
        )}
        keyExtractor={item => item.postId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E8F5E9', // A light green background
  },
});

export default BlogScreen;
