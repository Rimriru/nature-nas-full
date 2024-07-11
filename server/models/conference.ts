import { Schema, model } from 'mongoose';
import type { IConference } from '~/types/ConfsDataFromDb';

const conferenceSchema: Schema<IConference> = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Описание конференции является обязательным']
    },
    startDate: {
      type: String,
      required: [true, 'Дата начала конференции является обязательной']
    },
    endDate: {
      type: String
    },
    content: {
      type: String,
      required: [true, 'Контент конференции является обязательным']
    },
    cover: {
      type: String,
      required: [true, 'Обложка конференции является обязательной'],
      validate: /.(?:png|jpg|jpeg)$/
    }
  },
  { versionKey: false }
);

const ConferenceModel = model('conference', conferenceSchema);
export default ConferenceModel;
