import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется заголовок страницы']
    },
    text: String,
    description: String,
    sections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'section'
    },
    personaOne: {
      name: {
        type: String,
        default: ''
      },
      telNumber: {
        type: String,
        default: ''
      },
      faxNumber: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      photo: {
        path: {
          type: String
        },
        filename: {
          type: String
        }
      }
    },
    personaTwo: {
      name: {
        type: String,
        default: ''
      },
      telNumber: {
        type: String,
        default: ''
      },
      faxNumber: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      photo: {
        path: {
          type: String
        },
        filename: {
          type: String
        }
      }
    },
    photos: {
      type: [mongoose.Schema.Types.Mixed]
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Необходимо передать роут'],
      unique: true
    }
  },
  { versionKey: false }
);

const Content = mongoose.model('content', contentSchema);
export default Content;
