import { useParms } from "react-router-dom";

function MoviDetail() {
    const {id} = useParms();

    return(
        <div>
            <h2>Movie detail page</h2>
            <p>Showing movie with id: {id}</p>
        </div>
    );
}

export default MoviDetail;