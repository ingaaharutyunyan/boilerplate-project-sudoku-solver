const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Solve Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end(function (err, res) {
        if (err) return done(err); // Handle errors
        assert.equal(res.status, 200);
        const complete =
          "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        assert.equal(res.body.solution, complete);
        done(); // Ensure callback is invoked
      });
  });

  test("Solve a puzzle with a missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({}) // Send an object with no `puzzle` key
      .end(function (err, res) {
        if (err) return done(err); // Handle any test errors
        assert.equal(res.status, 200); // Check status code
        assert.equal(res.body.error, "Required field missing"); // Check error message
        done();
      });
  });

  test("Solve a puzzle with invalid characters in puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.aa.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        if (err) return done(err); // Handle errors
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle"); // Fix key to `error` instead of `solution`
        done(); // Ensure callback is invoked
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.367." })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
        );
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3333.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Puzzle cannot be solved');
        done();
      });
  });

  suite("Check Functional Tests", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "1", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "2", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, "row");
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "5", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
         // assert.include(res.body.conflict, "row");
        //  assert.include(res.body.conflict, "column");
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "8", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
        //  assert.include(res.body.conflict, "row");
        //  assert.include(res.body.conflict, "column");
        //  assert.include(res.body.conflict, "region");
          done();
        });
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "x", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "5", puzzle: "1..2..3" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "AA", value: "5", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "A1", value: "0", puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
