// ecosystem.config.js
module.exports = {
	apps: [
		{
			name: "next16-app",
			script: "./server.js",
			instances: 1, // Run 1 instances
			exec_mode: "cluster",
			env: {
				PORT: 3002, // Starting port
				HOSTNAME: "127.0.0.1",
				NODE_ENV: "production",
			},
		},
	],
};
