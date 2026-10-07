const UserCard = ({ user }) => {
  const { firstName, lastName, about, photoUrl, age, gender } = user;
  return (
    <div className="card bg-base-300 w-76 shadow-sm  rounded-lg">
      <figure>
        <img src={photoUrl} alt="userphoto" className="w-full" />
      </figure>
      <div className="card-body mx-4">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && <p>{age}</p>}
        {gender && <p>{gender}</p>}
        <p>{about}</p>
        <div className="card-actions my-3">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
