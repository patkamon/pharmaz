pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Prescription is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;

    constructor() ERC721("Prescription", "PST") {
        // only owner will be able to do some task.
        owner = msg.sender;
    }

    function create(string memory tokenURI, address patient)
        public
        returns (uint256)
    {
        // only doctor (owner) that create prescription
        require(tx.origin == owner, "Not Owner");
        require(patient != address(0), "Patient Address not exist!");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // mint prescription and send to patient
        _mint(patient, newItemId);

        // set tokenURI for patient
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function getTokenAmount() public view returns (uint256) {
        return _tokenIds.current();
    }
}
