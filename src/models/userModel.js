import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    sentRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'FriendRequest'
    }],
    recievedRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'FriendRequest'
    }],
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        }
    },
    timestamps: true
});

export const User = model('User', userSchema);