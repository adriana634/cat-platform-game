class Enemy {
    constructor({ x, y, waypoints, image, imageReverse, width, height }) {
        this.position = {
            x,
            y
        };

        this.velocity = {
            x: 0,
            y: 1
        };

        this.waypoints = waypoints;
        this.currentWaypointPosition = this.waypoints[0].initial;
        this.currentWaypointIndex = 0;

        this.image = image;
        this.imageReverse = imageReverse;
        this.currentImage = image;

        this.width = width;
        this.height = height;
    }

    handleWaypoints() {
        const currentWaypoint = this.waypoints[this.currentWaypointIndex];

        if (currentWaypoint.initial < currentWaypoint.final) {
            if (this.currentWaypointPosition < currentWaypoint.final) {
                this.position.x += 0.5;
                this.currentWaypointPosition += 0.5;
            } else {
                if (this.currentWaypointIndex === this.waypoints.length - 1) {
                    this.currentWaypointIndex = 0;
                } else {
                    this.currentWaypointIndex += 1;
                }

                const nextWaypoint = this.waypoints[this.currentWaypointIndex];
                this.currentWaypointPosition = nextWaypoint.initial;
            }

            this.currentImage = this.image;
        } else {
            if (this.currentWaypointPosition > currentWaypoint.final) {
                this.position.x -= 0.5;
                this.currentWaypointPosition -= 0.5;
            } else {
                if (this.currentWaypointIndex === this.waypoints.length - 1) {
                    this.currentWaypointIndex = 0;
                } else {
                    this.currentWaypointIndex += 1;
                }

                const nextWaypoint = this.waypoints[this.currentWaypointIndex];
                this.currentWaypointPosition = nextWaypoint.initial;
            }

            this.currentImage = this.imageReverse;
        }
    }

    draw(context) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.handleWaypoints();

        context.drawImage(this.currentImage, this.position.x, this.position.y);
    }
}

export default Enemy;