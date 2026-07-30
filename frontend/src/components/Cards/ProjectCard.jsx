import { Link } from "react-router-dom";
import "./ProjectCard.css"
function ProjectCard(prop) {
    return (
        <Link to={`/projects/${prop.id}/environments`} className="project-link">
            <div>
                <p>Id : {prop.id}</p>
                <p>Name : {prop.name}</p>
                <p>Created at : {prop.created_at}</p>
            </div>
        </Link>
    );
}

export default ProjectCard;