/* eslint-disable react-hooks/set-state-in-effect */
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.log("Premium Verification Failed: ", err);
    }
  };
  
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true },
    );

    //It should open the razoprpay dailog box
    const { keyId, amount, currency, orderId, notes } = order.data;
    console.log(notes);
    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Pair",
      description: "Connect to other developers",
      order_id: orderId,

      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
    <h1 className="font-bold m-10">You're already a Premium User</h1>
  ) : (
    <div className="m-10">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
          <h1 className="font-bold text-3xl">Silver MemberShip</h1>
          <ul>
            <li> - Chat with other people </li>
            <li> - 100 connection Request per day </li>
            <li> - Blue tick for 3 months</li>
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => handleBuyClick("silver")}
          >
            Silver
          </button>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
          <h1 className="font-bold text-3xl">Gold MemberShip</h1>
          <ul>
            <li> - Chat with other people </li>
            <li> - Infinite connection Request per day </li>
            <li> - Life time Blue tick </li>
          </ul>
          <button
            className="btn btn-secondary"
            onClick={() => handleBuyClick("gold")}
          >
            Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
