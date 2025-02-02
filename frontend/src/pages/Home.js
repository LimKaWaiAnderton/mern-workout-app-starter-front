import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// Components
import WorkoutDetails from "../componenets/WorkoutDetails";
import WorkoutForm from "../componenets/WorkoutForm";

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [sortOrder, setSortOrder] = useState("desc"); // Default sort: newest first

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "SET_WORKOUTS", payload: json });
            }
        };

        if (user) {
            fetchWorkouts();
        }
    }, [dispatch, user]);

    // Sort workouts based on createdAt and sortOrder
    const sortedWorkouts = workouts
        ? [...workouts].sort((a, b) => {
              if (sortOrder === "asc") {
                  return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
              } else {
                  return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
              }
          })
        : [];

    return (
        <div className="home">
            <div className="sidebar">
                <div className="sort-block">
                    <h4>Sort Workouts</h4>
                    <label>Sort by:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Newest</option>
                        <option value="asc">Oldest</option>
                    </select>
                </div>
                <WorkoutForm />
            </div>
            <div className="main-content">
                <div className="workouts">
                    {sortedWorkouts &&
                        sortedWorkouts.map((workout) => (
                            <WorkoutDetails key={workout._id} workout={workout} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
