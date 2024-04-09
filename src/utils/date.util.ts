import * as dayjs from 'dayjs';
import * as moment from "moment";

export const addTime = (date: Date, value: number, unit: dayjs.ManipulateType) => {
  return dayjs(date).add(value, unit).toDate();
}

export const getDate = () => {
  const today = moment().format('YYYY-MM-DD');
  return today;
}

export const getFirstDateBy = (type) => {
  return moment().startOf(type).format('YYYY-MM-DD');
}

export const getEndDateBy = (type) => {
  return moment().endOf(type).format('YYYY-MM-DD');
}