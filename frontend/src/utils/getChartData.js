import axios from "axios";
import Cookies from "js-cookie";

export default async function getChartData() {
  let data = [];
  const user = Cookies.get("userInfo");
  const { token } = JSON.parse(user);
  try {
    const res = await axios.get("http://localhost:1337/dahsboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    await Promise.all(res.data.listAllTransaction.map(async (transaction) => {
      data.push({ close: transaction.amount, date: new Date(transaction.createdAt).toISOString() });
    }));
  } catch (err) {
    console.error(err);
  }
  return {
    data,
    length: data.length
  };
}
