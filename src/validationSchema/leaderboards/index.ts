import * as yup from 'yup';

export const leaderboardValidationSchema = yup.object().shape({
  points: yup.number().integer().required(),
  hacker_id: yup.string().nullable(),
});
