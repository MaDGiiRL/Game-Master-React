export default function Footer() {
    return (
        <footer className="bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6" style={{zIndex: 9}}>
            <div className=" max-w-7xl mx-auto px-6 text-center space-y-2">
                <p className="text-sm">&copy; 2025 <span className="font-semibold text-indigo-400">Game Master</span>. All rights reserved.</p>
                <p className="text-xs text-gray-400">Developed with ❤️ by <span className="text-indigo-400">Sofia Vidotto</span></p>
                {/* Built with ❤️ using <span className="text-indigo-400">React</span> & <span className="text-indigo-400">Tailwind CSS</span> */}
            </div>
        </footer>
    );
}
