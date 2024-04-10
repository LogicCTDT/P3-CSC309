import { useNavigate } from "react-router-dom";


export default function LandingPage(){
    const navigate = useNavigate();
    const handleSubmit = () => navigate('/ViewResponded', { replace: false });

    return (
        <div>
            <button onClick={handleSubmit}>Go To ViewResponded</button>
        </div>
    );
}
