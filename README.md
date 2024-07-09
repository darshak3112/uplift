## Uplift: Collaborative Testing Platform

**Uplift** is a web application that connects creators with testers, fostering a collaborative environment for feedback and improvement. Here's a breakdown of the platform's functionalities for its three user types:

**1. Creators:**

* **Marketers:** Upload marketing materials like ad copy, social media posts, or email campaigns.
* **YouTubers:** Upload video thumbnails and target specific tester demographics based on desired audience. 
* **App Developers:** Upload their applications for beta testing and receive bug reports and feedback.

**2. Testers:**

* **Review Content:**  Evaluate and provide feedback on uploaded content like thumbnails, marketing materials, and applications.
* **Earn Rewards:**  Receive cryptocurrency rewards (rupees, dollars, or INR) for completing tasks.
* **Build Reputation:** Gain badges and recognition points based on the quality and quantity of their reviews.

**3. Super Admin:**

* **User Management:** Create, manage, and deactivate user accounts for creators and testers.
* **Task Oversight:** Monitor active and completed tasks, ensuring smooth platform operation.
* **Analytics Dashboard:** View platform usage statistics and track trends in user engagement and task completion rates.
* **Dispute Resolution:** Mediate and resolve any disagreements between creators and testers.


**Key Features:**

* **ML-powered Matching:** Uplift utilizes a machine learning algorithm to match creators with testers based on their interests, demographics, and past performance.
* **Gamification:** A leaderboard and achievement system incentivize tester participation and high-quality feedback.
* **Community Features:** Testers can interact through a forum and chat functionalities, promoting knowledge sharing and collaboration.
* **Secure Crypto Payments:** Secure integration with cryptocurrency payment gateways allows for seamless reward distribution.


**Getting Started:**

1. **Sign Up:**  Create an account as a creator, tester, or super admin.
2. **Complete Profile:** Provide relevant information to establish your role and expertise.
3. **Explore Features:** As a creator, post tasks and select testers. As a tester, browse available tasks and submit your feedback. Super admins can manage users, tasks, and overall platform operations.


**Technology Stack (Potential):**

* **Frontend:** React.js, Next.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Machine Learning:** TensorFlow.js or PyTorch.js
* **Cloud Storage:** AWS S3, Google Cloud Storage, or Azure Blob Storage
* **Cryptocurrency Payment Gateway:** Coinbase Commerce, Stripe Connect


**Version Control:**

* We will be using a Git version control system for code management.
* The main development branch will be named `main`.
* Feature development will be done on separate branches for better organization. Branch names will follow a standardized format, typically including a descriptive prefix (e.g., `feat/`, `fix/`, `refactor/`, etc.) followed by a concise description of the feature or change being implemented.
* Commit messages should be clear and concise, following a convention like "[type]: [short description] (#issue number)" where:
    * `type` is a category like `feat` (feature), `fix` (bug fix), `refactor` (code improvement), `docs` (documentation change), etc.
    * `short description` briefly describes the change.
    * `#issue number` (optional) references a related issue tracking system ticket.


**Uplift empowers creators to gain valuable insights and iterate on their work, while testers are rewarded for their contributions. This collaborative platform fosters innovation and drives success for all users.**

# Commit Type Convention

We follow a specific commit type convention to categorize changes in our codebase. Each commit message should start with one of the following commit types:

- `feat:` A new feature or enhancement added to the codebase.
- `fix:` A bug fix or correction to resolve an issue.
- `docs:` Documentation changes or updates.
- `style:` Changes related to code formatting, indentation, or whitespace.
- `refactor:` Code refactoring without adding new features or fixing bugs.
- `test:` Addition or modification of test cases.
- `chore:` Other changes not directly affecting the code (e.g., build scripts, dependencies).
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

