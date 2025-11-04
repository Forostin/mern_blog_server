import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map((obj) => obj.tags).flat().slice(0, 5);  
    
      if (!tags) {
      return res.status(500).json({
        message: 'Не удалось получить теги',
      })}

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

// ------------------------------- Получение коментариев:
// export const getComments = async (req, res) => {
//   try {
//     const posts = await PostModel.find().limit(5).exec();

//     const coments = posts.map((obj) => obj.comments).flat().slice(0, 5);  
    
//       if (!coments) {
//       return res.status(500).json({
//         message: 'Нет комментариев',
//       })}

//     res.json(coments);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить комментарии',
//     });
//   }
// };


export const getAll = async (req, res) => {
  try {
    
    const posts = await PostModel.find().populate('user').exec();

    if (!posts) {
      return res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
    res.json(posts);

  } catch (err) {
      console.log(err);
      res.status(500).json({
      message: 'Не удалось вернуть статью',
    });
  }
};
// ----------------------------------Сортировка по дате:
export const getSortTimePosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: 'Статьи не найдены',
      });
    }

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
// ---------------------------------- Сортировка по количеству просмотров
export const getPopularPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: 'Статьи не найдены',
      });
    }

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

// ---------------------------------- Сортировка по тегу:
export const sortPostsTag = async (req, res) => {
  try {
    const tagName = req.params.tag; // получаем тег из URL
    const posts = await PostModel.find({ tags: tagName })
      .populate('user')
      .sort({ createdAt: -1 }) // можно добавить сортировку по дате
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: `Статьи с тегом ${tagName} не найдены`,
      });
    }

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи по тегу',
    });
  }
};
// ----------------------------------------------------

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось вернуть статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};



export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags  || [],
      user: req.userId,
    } );
  
    const post = await doc.save();

    res.json(post);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося создати статтю, всі строки повинні бути заповненні',
    });
  }
};

// +++++++++++++++
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const document = await PostModel.updateOne(
      { _id: postId },
      { title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags || [] },
      { returnDocument: 'after' }
    )

    if (!document) {
      return res.status(500).json({
      message: 'Не удалось обновить статью',
    });
    }

    res.json(document);

  } catch (err) {
    console.log(err);
    res.status(500).json({
       message: 'Не удалось обновить статью'
    });
  }
};
