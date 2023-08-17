import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const GardenPost = ({ post, onLike, onDislike }) => {
    const [likes, setLikes] = useState(post.likes);

    const handleLike = () => {
        setLikes(prevLikes => prevLikes + 1);
        onLike(post.postId);
    };

    const handleDislike = () => {
        setLikes(prevLikes => prevLikes - 1);
        onDislike(post.postId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: post.profilePicture || 'default_profile_pic_link' }} style={styles.profilePic} />
                <Text style={styles.username}>{post.sharedBy}</Text>
            </View>
            <Image source={{ uri: post.gardenPicture }} style={styles.gardenImage} />
            <View style={styles.reactions}>
                <TouchableOpacity onPress={handleLike}>
                    <Text>👍</Text>
                </TouchableOpacity>
                <Text>{likes}</Text>
                <TouchableOpacity onPress={handleDislike}>
                    <Text>👎</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 15, // Spacing between each post
        backgroundColor: 'white', // White card background
        borderRadius: 5, // Rounded corners for card
        shadowColor: "#000", // Drop shadow for depth effect
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1, // Add border
        borderColor: '#A1887F', // Brownish border color
    },
    username: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#4CAF50', // Green font color
    },
    gardenImage: {
        width: '100%',
        height: 500,
        resizeMode: 'cover',
        marginTop: 10,  
        marginBottom: 10,
        borderRadius: 5, // Consistent with the card
    },
    reactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});


export default GardenPost;
