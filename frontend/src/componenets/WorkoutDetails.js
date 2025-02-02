import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(workout.title);
    const [load, setLoad] = useState(workout.load);
    const [reps, setReps] = useState(workout.reps);

    const handleUpdate = async () => {
        if (!user) {
            console.error('You must be logged in');
            return;
        }

        const updatedWorkout = { title, load, reps };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(updatedWorkout),
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_WORKOUT', payload: json });
            setIsEditing(false);
        } else {
            console.error(json.error);
        }
    };

    return (
        <div className="workout-details">
            {isEditing ? (
                <div>
                    <label>Exercise Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Load (kg):</label>
                    <input
                        type="number"
                        value={load}
                        onChange={(e) => setLoad(e.target.value)}
                    />
                    <label>Reps:</label>
                    <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg): </strong>{workout.load}</p>
                    <p><strong>Reps: </strong>{workout.reps}</p>
                    <p>{new Date(workout.createdAt).toLocaleString()}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default WorkoutDetails;
