import { useNavigate } from "react-router-dom";


export default function LandingPage(){
    const navigate = useNavigate();
    const handleSubmit = () => navigate('/register', { replace: false });

    return (
        <div>
            <button onClick={handleSubmit}>Go To ViewResponded</button>
        </div>
    );
}
