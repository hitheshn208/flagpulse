import "./NavBar.css"
function NavBar() {
    return (
        <header className="nav-bar">
            <div className="nav-brand" aria-label="flagpulse home">
                <div className="nav-logo-slot" aria-hidden="true" />
                <span className="nav-brand-name">Flagpulse</span>
            </div>
        </header>
    );
}

export default NavBar;