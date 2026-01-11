import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-300">404</h1>
                <p className="text-slate-600 mt-2 text-lg">Page not found</p>
                <Link to="/dashboard" className="btn btn-primary mt-6 px-6 py-2">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
