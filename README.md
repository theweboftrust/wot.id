# wot.id: Human Identity on the Web of Trust

wot.id is an open environment where any digitally connected actor – human, machine, hybrid, or otherwise - can manage and exchange assets, communicate, and handle trust with instantaneous speed, maximum security, and minimal cost. Built upon IOTA's advanced distributed ledger technology, any datapoint is permanently present on a directed acyclic graph (the real cloud), but can only be controlled by its owner.

For the human actors in the loop, wot.id offers the following fundamental capabilities:
*   **Clear Human Identification**: Enables individuals to clearly and verifiably identify themselves as human within the digital realm.
*   **True Data Ownership & Control**: Empowers humans to factually own and control all digitalized aspects of their existence.
*   **Value Realization**: Allows individuals to receive any value that can be created using their information.
*   **Selective Disclosure**: Provides the means to reveal any aspect of their digital existence to anyone, in any format, and with any desired degree of anonymity.
*   **Single Source of Truth**: Establishes a reliable single source of truth based on a comprehensive and detailed system of trust relationships.

This document provides a high-level overview of the project. For detailed information, please refer to the comprehensive documentation in the [`/docs`](docs/) directory.

---

## 1. Vision, Principles, and Governance

wot.id is guided by a robust set of principles to ensure a user-centric and decentralized ecosystem. Our vision is to empower individuals with full control over their digital lives, free from intermediaries.

*   **Project Overview and Principles**: Our mission is to create an open, secure, and fair digital identity system. We adhere to 10 core principles, including guaranteed human identity, strict peer-to-peer operation, and modular design. You can explore these in detail in [`01_Project_Overview_And_Principles.md`](docs/01_Project_Overview_And_Principles.md).

*   **Governance and Conflict Resolution**: The platform is designed for decentralized governance, ensuring no single entity has control. Our approach to community-led decision-making and conflict resolution is outlined in [`10_Governance_And_Conflict_Resolution.md`](docs/10_Governance_And_Conflict_Resolution.md).

## 2. System Architecture and Technology

The wot.id platform is built on a modular, multi-layered architecture designed for security, scalability, and interoperability.

*   **System Architecture**: The system comprises four main layers: the IOTA L1/L2 network, Move VM smart contracts, a Rust-based backend, and a Next.js frontend. The full architecture is detailed in [`02_System_Architecture.md`](docs/02_System_Architecture.md).

*   **IOTA Node and Network**: We leverage an IOTA rebased node with a Move VM, using the IOTA Tangle for feeless data anchoring and the L2 for smart contract execution. Learn more in [`03_IOTA_Node_And_Network.md`](docs/03_IOTA_Node_And_Network.md).

*   **Move Smart Contracts**: Our on-chain logic for identity, credentials, and trust is implemented using Move, a secure and resource-oriented smart contract language. The contract design is specified in [`05_WASP_L2_Smart_Contracts.md`](docs/05_WASP_L2_Smart_Contracts.md).

*   **Backend and Identity Service**: A high-performance Rust backend, powered by the Axum framework, orchestrates business logic and communication with the IOTA node. A separate `identity-service` isolates cryptographic operations. This is covered in [`04_Backend_And_Identity_Service.md`](docs/04_Backend_And_Identity_Service.md).

*   **Frontend and User Experience**: The user interface is a modern Next.js/TypeScript application, integrated with the IOTA DApp Kit for seamless wallet interaction. Read about the UX/UI strategy in [`08_Frontend_And_User_Experience.md`](docs/08_Frontend_And_User_Experience.md).

## 3. Core Features and Concepts

wot.id's architecture supports a rich set of features centered around identity, trust, and secure communication.

*   **Trust Architecture**: A sophisticated dual-model system allows for both direct, peer-attested trust and verifiable credential-based trust. The complete model, including transitive trust and aggregation, is described in [`07_Trust_Architecture_And_Management.md`](docs/07_Trust_Architecture_And_Management.md).

*   **P2P Communication**: The platform facilitates end-to-end encrypted messaging between DIDs, ensuring privacy and censorship resistance. The protocol is detailed in [`06_P2P_Communication.md`](docs/06_P2P_Communication.md).

*   **Data Storage and Asset Management**: User data is stored decentrally, and the platform supports secure, peer-to-peer management of digital assets. This is outlined in [`09_Data_Storage_And_Asset_Management.md`](docs/09_Data_Storage_And_Asset_Management.md).

## 4. Project Status and Roadmap

We are committed to transparency and best practices in our development process.

*   **Standards and Practices**: We adhere to leading industry standards (W3C DIDs, VCs) and maintain rigorous development practices. Our roadmap and standards are available in [`11_Standards_Practices_And_Roadmap.md`](docs/11_Standards_Practices_And_Roadmap.md).

*   **Current Code Status**: A comprehensive review of the entire codebase was conducted to assess its current state, identify critical issues, and define next steps. The detailed findings and a prioritized to-do list can be found in [`99_Code_Review.md`](docs/99_Code_Review.md).

