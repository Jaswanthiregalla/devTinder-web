/* eslint-disable no-unused-vars */
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useSelector } from "react-redux";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return null;
  }

  if (connections.length === 0) {
    <div className="flex justify-center">
      <h1 className="text-2xl">No Connections Found</h1>
    </div>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-2xl font-bold">Connections</h1>
      {connections.map((connection) => {
        const { _id, photoUrl, firstName, lastName, age, gender, about } =
          connection;
        return (
          <div
            key={_id}
            className="p-4 flex rounded-lg bg-base-300 w-1/2 mx-auto m-4"
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
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
