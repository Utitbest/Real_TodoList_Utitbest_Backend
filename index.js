// import { createServer } from "http";
// import { db } from "./db.js";
// import logger from "./logger.js";

// const PORT = process.env.NODEPORT || 5000;

// const send = (res, status, data) => {
//   res.writeHead(status, {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//   });
//   res.end(JSON.stringify(data));
// };

// const server = createServer(async (req, res) => {
//   const { url, method } = req;
//   try {
//     if (url === "/todo" && method === "GET") {
//       try {
//         const [task] = await db.query("SELECT * FROM task ORDER BY order_index ASC")
//         send(res, 200, task)
//       } catch (error) {
//         send(res, 500, {error: "Failed to Fetch todo!", detail: error.message})
//       }
//     } else if (url === "/todo" && method === "POST") {
//       let body = "";
//       req.on("data", chunk => (body += chunk));
//       req.on("end", async () => {
//         try {
//           const data = JSON.parse(body);

//           if (!data.text) return send(res, 400, { error: "Missing text Field" });

//           await db.query("UPDATE task SET order_index = order_index + 1");

//           const [result] = await db.query(
//             "INSERT INTO task (text, completed, order_index) VALUES (?, ?, ?)",
//             [data.text, false, 0]
//           );

//           const newtask = { id: result.insertId, text: data.text, completed: false, order_index: 0 };
//           send(res, 200, newtask);
//         } catch (error) {
//           logger.error(error);
//           send(res, 500, { error: "Failed to Add task", details: error.message });
//         }
//       });

//     } else if (url === "/todo/clear" && method === "DELETE") {
//        try {
//           const [result] = await db.query("DELETE FROM task WHERE completed = true");
//           if(result.affectedRows === 0){
//             return send(res, 404, {error: "No completed task found"})
//           }
//           send(res, 200, {succes: true, details: "Task Deleted successfully!"})
//         } catch (error) {
//           console.log(error)
//           send(res, 500, {error: "Failed to delete task", details: error.message})
//         }
//     } else if (url.startsWith("/todo/") && method === "PUT") {
//       const id = parseInt(url.split("/").pop(), 10);
//       if (isNaN(id)) return send(res, 400, { error: "Invalid task ID" });

//       let body = "";
//       req.on("data", chunk => (body += chunk));
//       req.on("end", async () => {
//         try {
//           const data = JSON.parse(body);
//           if (typeof data.completed !== "boolean") {
//             return send(res, 400, { error: "Missing or Invalid completed field" });
//           }

//           const [result] = await db.query("UPDATE task SET completed = ? WHERE id = ?", [data.completed, id]);
//           if (result.affectedRows === 0) return send(res, 404, { error: "Task not Found!" });

//           send(res, 200, { id, completed: data.completed });
//         } catch (error) {
//           logger.error(error);
//           send(res, 500, { error: "Failed to update task", details: error.message });
//         }
//       });
//     } else if (url.startsWith("/todo/order") && method === "PUT") {
//       let body = "";
//       req.on("data", chunk => (body += chunk));
//       req.on("end", async () => {
//         try {
//           const data = JSON.parse(body);
//           if (!Array.isArray(data.tasks)) return send(res, 400, { error: "Invalid tasks format" });

//           for (const t of data.tasks) {
//             await db.query("UPDATE task SET order_index = ? WHERE id = ?", [t.order_index, t.id]);
//           }

//           send(res, 200, { success: true });
//         } catch (error) {
//           logger.error(error);
//           send(res, 500, { error: "Failed to reorder tasks", details: error.message });
//         }
//       });

//     } else {
//       send(res, 404, { error: "Route not found" });
//     }
//   } catch (error) {
//     logger.error(error);
//     send(res, 500, { error: "Server Error", details: error.message });
//   }
// });

// server.listen(PORT, () => logger.info(`Node server running on port ${PORT}`));
import { createServer } from "http";
import { db } from "./db.js";
import logger from "./logger.js";

const PORT = process.env.NODEPORT || 5000;

const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
};

const server = createServer(async (req, res) => {
  const { url, method } = req;

  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  try {
    if (url === "/todo" && method === "GET") {
      try {
        const result = await db.query("SELECT * FROM task ORDER BY order_index ASC");
        send(res, 200, result.rows);
      } catch (error) {
        send(res, 500, { error: "Failed to fetch todo", detail: error.message });
      }
    }

    else if (url === "/todo" && method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const data = JSON.parse(body);
          if (!data.text) return send(res, 400, { error: "Missing text field" });

          await db.query("UPDATE task SET order_index = order_index + 1");

          const result = await db.query(
            "INSERT INTO task (text, completed, order_index) VALUES ($1, $2, $3) RETURNING id",
            [data.text, false, 0]
          );

          const newtask = {
            id: result.rows[0].id,
            text: data.text,
            completed: false,
            order_index: 0,
          };

          send(res, 200, newtask);
        } catch (error) {
          send(res, 500, { error: "Failed to add task", details: error.message });
        }
      });
    }

    else if (url === "/todo/clear" && method === "DELETE") {
      try {
        const result = await db.query("DELETE FROM task WHERE completed = true");
        if (result.rowCount === 0) {
          return send(res, 404, { error: "No completed tasks found" });
        }
        send(res, 200, { success: true });
      } catch (error) {
        send(res, 500, { error: "Failed to delete tasks", details: error.message });
      }
    }

    else if (url.startsWith("/todo/") && method === "PUT" && !url.includes("order")) {
      const id = parseInt(url.split("/").pop(), 10);
      if (isNaN(id)) return send(res, 400, { error: "Invalid task ID" });

      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const data = JSON.parse(body);
          if (typeof data.completed !== "boolean") {
            return send(res, 400, { error: "Invalid completed field" });
          }

          const result = await db.query(
            "UPDATE task SET completed = $1 WHERE id = $2",
            [data.completed, id]
          );

          if (result.rowCount === 0) return send(res, 404, { error: "Task not found" });

          send(res, 200, { id, completed: data.completed });
        } catch (error) {
          send(res, 500, { error: "Failed to update task", details: error.message });
        }
      });
    }

    else if (url === "/todo/order" && method === "PUT") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const data = JSON.parse(body);
          if (!Array.isArray(data.tasks)) return send(res, 400, { error: "Invalid tasks format" });

          for (const t of data.tasks) {
            await db.query("UPDATE task SET order_index = $1 WHERE id = $2", [
              t.order_index,
              t.id,
            ]);
          }

          send(res, 200, { success: true });
        } catch (error) {
          send(res, 500, { error: "Failed to reorder tasks", details: error.message });
        }
      });
    }

    else {
      send(res, 404, { error: "Route not found" });
    }
  } catch (error) {
    send(res, 500, { error: "Server error", details: error.message });
  }
});

server.listen(PORT, () => logger.info(`Node server running on port ${PORT}`));
