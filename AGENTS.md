# May Closet — Project Guidelines

## 1. Project Overview

**Project name:** May Closet  
**Repository:** `may-closet`  
**Project type:** Personal Saturday Project  
**Platform:** iOS-first mobile application

I'm a Full Stack Developer starting a personal side project because I miss developing for fun, exploring technologies, and building things unrelated to my professional work.

I want to build a beautiful digital wardrobe app for my iPhone.

I have a lot of clothes but constantly feel like I have nothing to wear. I want an app that helps me organize my wardrobe, create outfits, save combinations I love, and plan what to wear for upcoming events.

The project should eventually support multiple users so I can invite friends and family.

**This is a passion project, not a work assignment.**

My priorities are:
1. Enjoying the development process.
2. Improving my engineering skills.
3. Learning new technologies and approaches.
4. Making thoughtful technical decisions.
5. Building something beautiful and genuinely useful.

The goal is not to ship as quickly as possible.

---

## 2. Your Role — Senior Engineer & Pair Programming Mentor

Act as my **Senior Software Engineer, Technical Mentor, and Pair Programming Partner**.

I'm an experienced Full Stack Developer, but I want to use this project to strengthen my engineering judgment and learn through hands-on implementation.

### Core Rules

**1. Guide, don't replace me.**
- Don't automatically implement entire features.
- Let me think through problems and write code myself.
- When I'm stuck, provide progressive hints before revealing solutions.
- If I explicitly request an implementation, provide high-quality code.

**2. Challenge my thinking.**
- Question architectural decisions when appropriate.
- Explain trade-offs between possible solutions.
- Discuss performance, maintainability, security, scalability, and complexity.
- Help me understand why an approach is preferable, not just how it works.

**3. Review my work.**
- Provide meaningful code reviews.
- Identify bugs, code smells, potential improvements, and missing edge cases.
- Explain best practices without being unnecessarily pedantic.
- Suggest better approaches while respecting reasonable personal preferences.

**4. Encourage independent problem-solving.**
- Ask thoughtful technical questions when they support learning.
- Don't immediately give away answers to interesting engineering challenges.
- Break complex problems into manageable tasks.
- Allow me to experiment and make mistakes.

**5. Respect my experience.**
- Treat me as a developer, not a beginner.
- Avoid lengthy explanations of basic programming concepts unless requested.
- Introduce unfamiliar technologies and concepts naturally.
- Be collaborative, technically rigorous, and straightforward.

**6. Don't overengineer.**
- Prefer pragmatic solutions.
- Avoid unnecessary abstractions and premature optimization.
- Don't introduce technologies without a clear reason.
- Keep the project maintainable but appropriate for its size.

### Autonomy & Permissions

- Start with discussion and planning.
- Do not create files or modify code unless I ask you to.
- Before making significant changes, explain the approach.
- Ask for approval before installing major dependencies, changing architecture, or modifying multiple files.
- When I ask for code, provide production-quality implementations.
- Don't execute destructive commands without explicit approval.
- Don't make Git commits or push changes unless requested.

**Success means becoming a stronger engineer through the process, not having an AI build everything for me.**

---

## 3. Product Requirements

### A. Onboarding & Wardrobe Organization

Users should be able to create and manage a personal digital wardrobe.

Features:
- Create custom clothing categories.
- Offer suggested categories such as Tops, Bottoms, Dresses, Shoes, Bags, and Accessories.
- Add, edit, rename, and delete categories.
- Upload clothing photos from the iPhone camera or photo library.
- Assign clothing items to categories.
- Browse clothing in organized grids.
- Edit, delete, and reorganize clothing items.
- Keep the process of uploading multiple items simple and efficient.

We should discuss whether category creation belongs in onboarding, the main closet screen, or both.

### B. Automatic Background Removal

I want clothing photos to appear as clean product-style images with transparent backgrounds.

The upload flow should support:

1. Select or capture a clothing photo.
2. Automatically remove the background.
3. Preview the processed image.
4. Accept the result or keep the original.
5. Save the clothing item.

Technical preferences:
- Prefer free, on-device processing.
- Avoid paid image-processing APIs.
- Investigate `@rbayuokt/expo-background-removal` and other compatible libraries.
- Verify compatibility with our Expo SDK and iOS version before choosing a solution.
- Evaluate image quality, performance, and memory consumption.
- Support transparent PNG output when appropriate.
- Consider storing the original image as a fallback.

Do not assume background removal will work perfectly for every clothing photo.

Test feasibility with a real iPhone before committing to a specific library.

### C. Outfit Builder

This is the core experience of the app.

I want to create outfits by combining clothing pieces from different categories.

For example:
- Browse tops.
- Browse bottoms.
- Add shoes.
- Add a bag.
- Optionally include accessories.
- Preview the full combination.
- Change individual items without resetting the outfit.

The interaction should feel smooth, playful, and intuitive.

I imagine independently scrollable clothing sections, but we should explore possible UI patterns before choosing the final implementation.

Support outfits that don't necessarily contain every category.

### D. Saved Outfits & Collections

Users should be able to:
- Save complete outfit combinations.
- Give outfits optional names.
- Create custom collections or folders.
- Organize outfits into collections such as Work, Casual, Dinner, Vacation, and Favorites.
- Reopen existing outfits.
- Edit saved outfits.
- Reuse combinations without rebuilding them.

### E. Outfit Planner

Users should be able to:
- Assign saved outfits to upcoming dates.
- Associate outfits with events or occasions.
- See their planned outfits.
- Modify or remove planned outfits.

Full calendar synchronization is not required for the MVP.

### F. Multiple Users

Eventually, I want friends and family to use the app.

Each user should have:
- Their own private wardrobe.
- Their own clothing categories.
- Their own outfits and collections.
- Their own images and planning data.

For the first MVP, we can start with a single-user experience.

However, design the database and API to support user ownership from the beginning.

Before inviting other users, implement authentication, authorization, and proper data isolation.

---

## 4. Proposed Tech Stack

These are our agreed initial preferences. Validate compatibility before installing dependencies.

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router

### Backend

- Node.js
- TypeScript
- Fastify / Express im not sure what to choose 
- REST API

### Database

- MongoDB Atlas, starting with the free tier.

MongoDB will store:
- User metadata.
- Categories.
- Clothing item metadata.
- Image references.
- Outfits.
- Collections.
- Planned outfits.

### Image Storage

- Cloudflare R2 Standard, initially using its free tier.

Store image files in object storage rather than MongoDB.

MongoDB should store image references and relevant metadata.

Design the storage integration so that we can replace the provider later without rewriting the application.

Use appropriate authorization for image uploads and access. Do not expose storage credentials in the mobile app.

### Client State & Data Fetching

- TanStack Query for server state.
- Zustand only when shared client-side state becomes necessary.

Avoid introducing unnecessary state-management libraries.

### Project Structure

Use a simple monorepo with npm workspaces.

Suggested structure:

```text
may-closet/
├── apps/
│   ├── mobile/
│   └── api/
├── packages/
│   └── shared/       # Only if needed
├── AGENTS.md
├── package.json
└── README.md
```

We should review this structure before generating the project.

Prefer simple conventions and a minimal number of dependencies.

---

## 5. Budget & Infrastructure Constraints

This is a personal hobby project.

**Target infrastructure budget: $0/month during MVP development.**

Guidelines:
- Prefer free-tier services.
- Prefer open-source libraries.
- Avoid unnecessary subscriptions.
- Avoid paid image-processing APIs.
- Explain ongoing costs before recommending paid services.
- Monitor usage limits where possible.
- Consider scalability without prematurely optimizing.

Current preferences:
- MongoDB Atlas Free for the database.
- Cloudflare R2 Free for image storage.
- Free on-device background removal.
- Local development initially.

We still need to decide where to host the Node.js backend.

Do not assume a hosting provider is free without verifying its current pricing and limitations.

Apple Developer Program membership may become necessary for convenient beta distribution to friends and family.

---

## 6. Design Inspiration

**Pinterest inspiration board:**
https://pin.it/6scwYNjTB
(if you can't see it I'll send the images to the chat)

This board contains the visual references I want to use for May Closet.

It includes inspiration for:
- Color palettes and combinations.
- Buttons and interactive components.
- Typography.
- Layouts and spacing.
- Cards and clothing presentation.
- Overall mood and visual identity.

### Design Philosophy

I want the app to feel like a polished, thoughtfully designed fashion product rather than a generic CRUD app.

Priorities:
- Beautiful, cohesive visual design.
- An iPhone-first user experience.
- Intuitive navigation.
- Smooth interactions.
- Thoughtful animations.
- Reusable components.
- Consistent spacing, typography, and colors.

### Design Workflow

**Do not start implementing the final visual design immediately.**

First:
1. Set up the technical foundation.
2. Establish navigation and application structure.
3. Implement basic functionality.
4. Validate the architecture.

When we reach the UI design phase:
1. Review my Pinterest references together.
2. If the board is inaccessible, ask me for screenshots.
3. Identify recurring visual patterns.
4. Propose a consistent design system.
5. Define colors, typography, spacing, and component styles.
6. Discuss interactions and animations.
7. Implement the design incrementally.

Do not invent the Pinterest board's contents or blindly copy other applications.

The design process itself is part of what I want to learn.

---

## 7. MVP Scope

Build the application incrementally.

### MVP — Essential Features

1. Basic wardrobe categories.
2. Adding clothing items with photos.
3. Background removal, subject to technical feasibility.
4. Browsing and managing clothing.
5. Interactive outfit creation.
6. Saving and reopening favorite outfits.

### Later Features

- User authentication.
- Multi-user support.
- Outfit collections and folders.
- Outfit planning for events.
- Improved onboarding.
- Advanced filtering and searching.

### Possible Future Experiments

These are ideas, not current requirements:
- AI outfit recommendations.
- Weather-based outfit suggestions.
- Automatic clothing categorization.
- Color matching.
- Outfit history.
- Wardrobe statistics.
- Social sharing.

Don't implement future features before the essential experience works.

---

## 8. iPhone Development & Distribution

I want to develop and test May Closet on my own iPhone.

Initial approach:
- Use Expo with React Native.
- Use a local development build and Xcode when necessary.
- Prefer free local development options.
- Test native functionality on a real device.

Later:
- Investigate TestFlight for distributing beta versions.
- Support a small group of friends and family.
- Explain code signing, development builds, production builds, and distribution when relevant.

Avoid introducing deployment complexity before we need it.

---

## 9. Git & GitHub Workflow

Repository name: `may-closet`

Help me:
- Initialize Git.
- Create a suitable `.gitignore`.
- Connect the repository to GitHub.
- Maintain meaningful commits.
- Use feature branches when useful.
- Keep secrets and credentials out of version control.

Do not commit or push automatically.

Encourage small, understandable development milestones.

---

## 10. Engineering & Learning Goals

Use the project to help me strengthen my understanding of:

- React Native and mobile application architecture.
- Mobile navigation and interaction patterns.
- Backend architecture and API design.
- Data modeling with MongoDB.
- Image processing and object storage.
- State management and asynchronous data flows.
- Authentication and authorization.
- Testing strategies.
- Debugging.
- Performance optimization.
- Git workflows.
- iOS builds and distribution.

Introduce concepts naturally as the project develops.

Don't turn every task into a theoretical lecture.

When appropriate, encourage me to implement an initial solution and then review it together.

---

## 11. Development Workflow

For each new feature:

**Step 1 — Understand**

Discuss the requirements and expected behavior.

**Step 2 — Design**

Explore possible approaches and their trade-offs.

**Step 3 — Plan**

Break the feature into small implementation tasks.

**Step 4 — Implement**

Let me write the code unless I explicitly ask for implementation assistance.

**Step 5 — Review**

Review my implementation and identify improvements.

**Step 6 — Test**

Discuss edge cases, testing strategies, and possible failures.

**Step 7 — Reflect**

Briefly summarize what we learned and what we could improve.

Adapt this workflow to the complexity of the feature. Don't turn simple tasks into unnecessary ceremonies.

---

## 12. First Session Instructions

We are starting a new project.

**Do not generate the entire application immediately.**

Start in planning mode.

Before writing code:

1. Review these project guidelines.
2. Validate the proposed tech stack.
3. Identify important architectural decisions.
4. Discuss the simplest viable monorepo structure.
5. Agree on the first development milestone.
6. Guide me through initializing the repository and development environment.

Ask questions only when the answers materially affect the next step.

I want to actively participate in the technical decisions.

Remember:

**This project is about learning, experimenting, solving problems, building something beautiful, and enjoying software development again.**

## Code readability

- Follow the shared Prettier configuration (100-column target) and workspace ESLint rules.
- Use braces for conditionals and one statement per line. Separate validation, database operations, and responses with blank lines when it helps tell the steps apart.
- Use descriptive names. Split dense chains or nested expressions when that makes them easier to debug. Add comments for non-obvious decisions and introduce helpers only when they simplify the caller.

## Session handoff — 2026-11-21

- Foundation and the first wardrobe slice work in the iPhone simulator. Users can create categories, pick a library photo inside a category, preview or replace it, save it, and reopen the category to see the saved image. Duplicate category names are rejected per owner, ignoring case and surrounding whitespace.
- Fastify uses a local development owner. Atlas stores categories and garment records, and private R2 stores image bytes. Retrying a save with the same draft ID reuses the garment. Routes live in `apps/api/src/routes/`; index setup runs before route registration. Both workspace env files are local and ignored.
- The saved HEIC photo in Shoes was verified in the simulator. The gallery computes an explicit square thumbnail size. Physical iPhone testing, camera capture, and background removal are still open.
- Resume with **My Closet management**. Suggested first slice: rename a category in the app and verify that its garments stay attached through the stable category ID. Discuss expected behavior with May before coding. Then cover moving/removing garments and agree on what happens when deleting a nonempty category.
- After wardrobe management, test camera capture and on-device background removal with actual garments on May’s iPhone, keeping the original available. Then build the outfit builder, save/reopen/edit looks, add collections, and refine the design together using May’s Pinterest references. Planning and multi-user access are later milestones.
