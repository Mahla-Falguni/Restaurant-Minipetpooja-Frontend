import { useState } from "react";

const Feedback = () => {
  const [rating, setRating] =
    useState(5);

  return (
    <div className="max-w-xl mx-auto mt-10">

      <div className="bg-white p-8 rounded-xl shadow">

        <h1 className=" text-3xl font-bold mb-5" >
          Give Feedback
        </h1>

        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
          className=" w-full border p-3 rounded-lg" >
          <option value="5">
            ⭐⭐⭐⭐⭐
          </option>

          <option value="4">
            ⭐⭐⭐⭐
          </option>

          <option value="3">
            ⭐⭐⭐
          </option>

          <option value="2">
            ⭐⭐
          </option>

          <option value="1">
            ⭐
          </option>
        </select>

        <textarea
          rows="5"
          className=" mt-4 w-full border p-3 rounded-lg"
          placeholder="Write your feedback"
        />

        <button className=" mt-4 w-full bg-orange-500 text-white py-3 rounded-lg"  >
          Submit Feedback
        </button>

      </div>

    </div>
  );
};

export default Feedback;