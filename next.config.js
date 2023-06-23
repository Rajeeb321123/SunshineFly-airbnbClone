/** @type {import('next').NextConfig} */
const nextConfig = {
    // for host names for image src
    images:{

        domains: [
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com",
            "res.cloudinary.com",
        ]
    }
}

module.exports = nextConfig
