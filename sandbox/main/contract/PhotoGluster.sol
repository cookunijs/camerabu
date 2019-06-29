pragma solidity 0.5.3;
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

//ropsten ContractAddress: 0x75e406a32e0589a9ee0b83148928fd7f2099780b

contract Photo{
    using SafeMath for uint256;
    // This struct is for the properties of a post.
    struct Post{
        string imgHash;
        string userNameHash;
        string shutterSpeedValueHash;
        string fNumberHash;
        string isoHash;
    }
    // A mapping list for posts from Post struct.
    mapping(uint256 => Post) posts;
    
    // A counter for the posts mapping list.
    uint256 postCtr;
    
    // Event which will notify new posts.
    event NewPost();
    
    function sendHash(
        string memory _img,
        string memory _userName,
        string memory _shutterSpeedValue,
        string memory _fNumber,
        string memory _iso
    )
        public
    {
        postCtr = postCtr.add(1);
        Post storage posting = posts[postCtr];
        posting.imgHash = _img;
        posting.userNameHash = _userName;
        posting.shutterSpeedValueHash = _shutterSpeedValue;
        posting.fNumberHash = _fNumber;
        posting.isoHash = _iso;
        emit NewPost();
    }
    
    /**
     * @dev Function to get image & text hashes.
     * @param _index number from total posts iteration.
     * @return Stored image & text hashes.
     */ 
    function getHash(uint256 _index) 
        public 
        view 
        returns (
            string memory img, 
            string memory userName, 
            string memory shutterSpeedValue, 
            string memory fNumber, 
            string memory iso
        )
    {
        img = posts[_index].imgHash;
        userName = posts[_index].userNameHash;
        shutterSpeedValue = posts[_index].shutterSpeedValueHash;
        fNumber = posts[_index].fNumberHash;
        iso = posts[_index].isoHash;
    }
    
    /**
     * @dev Function to get length of total posts.
     * @return The total count of posts.
     */
    function getCounter() public view returns(uint256) { return postCtr; }
}