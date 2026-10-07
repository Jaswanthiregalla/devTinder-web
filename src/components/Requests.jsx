/* eslint-disable react-hooks/exhaustive-deps */
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";
const Requests = () => {
  const requests = useSelector((store) => store.requests);

  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return null;
  }

  if (requests.length === 0) {
    <div className="flex justify-center">
      <h1 className="text-2xl">No Requests Found</h1>
    </div>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-2xl font-bold">Requests</h1>
      {requests.map((request) => {
        const { _id, photoUrl, firstName, lastName, age, gender, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="p-4 flex justify-between items-center rounded-lg bg-base-300 w-2/3 mx-auto m-4"
          >
            <div>
              <img src={photoUrl} alt="photo" className="w-20 rounded-full" />
            </div>
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              <p>{about}</p>
              {age && gender && <p>{age + " , " + gender}</p>}
            </div>
            <div>
              <button className="btn btn-primary mx-2">Reject</button>
              <button className="btn btn-secondary mx-2">Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
