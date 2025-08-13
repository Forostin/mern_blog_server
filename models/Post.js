import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);



// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema(
//     {
//         username: {type: String},
//         title: {type: String , required: true},
//         text: {type: String, required: true},
//         imgUrl: {type: String, default: ''},
//         views: {type: Number, default: 0},
//         author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//         comments: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'} ]
//     },
//     {timestamps: true}
// );

// export default mongoose.model('Post', PostSchema);