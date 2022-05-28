pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Prescription.sol";

contract Prescription is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;

    constructor(address _prescription) ERC721("Receipt", "RCP") {
        // only owner will be able to do some task.
        owner = msg.sender;
        prescription = Prescription(_prescription);
    }

    function create(
        uint256,
        tokenId,
        string memory tokenURI,
        address patient
    ) public returns (uint256) {
        // only pharmacist (owner) that create receipt
        require(tx.origin == owner, "Not Owner");
        require(patient != address(0), "Patient Address not exist!");

        // take prescription
        ERC721(prescription).transferFrom(patient, address(this), tokenId);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // mint receipt and send to patient
        _mint(patient, newItemId);

        // set tokenURI for patient
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
